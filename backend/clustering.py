#!/usr/bin/env python3
# -*- coding: utf-8 -*-

r"""
Life's pathetic, have fun ("▔□▔)/hi~♡ Nasy.

Excited without bugs::

    |             *         *
    |                  .                .
    |           .
    |     *                      ,
    |                   .
    |
    |                               *
    |          |\___/|
    |          )    -(             .              ·
    |         =\ -   /=
    |           )===(       *
    |          /   - \
    |          |-    |
    |         /   -   \     0.|.0
    |  NASY___\__( (__/_____(\=/)__+1s____________
    |  ______|____) )______|______|______|______|_
    |  ___|______( (____|______|______|______|____
    |  ______|____\_|______|______|______|______|_
    |  ___|______|______|______|______|______|____
    |  ______|______|______|______|______|______|_
    |  ___|______|______|______|______|______|____

author   : Nasy https://nasy.moe
date     : Apr 11, 2020
email    : Nasy <nasyxx+python@gmail.com>
filename : clustering.py
project  : backend
license  : GPL-3.0+

At pick'd leisure
  Which shall be shortly, single I'll resolve you,
Which to you shall seem probable, of every
  These happen'd accidents
                          -- The Tempest
"""
# Standard Library
import re
from collections import Counter
from csv import DictReader
from functools import lru_cache
from itertools import chain

# Others
import numpy as np
import ujson as json
from nptyping import NDArray
from sklearn.cluster import MiniBatchKMeans

# Config
from config import DATA, DATA_PATH

# Types
from module import Map, Point
from typing import Counter as CounterT
from typing import List, Tuple

SIZE = 47140
PKWS = set()  # type: Set[str]

with (DATA / "scibert_embeddings.json").open() as _f, (
    DATA / "n_tfidf_ys"
).open() as _ys, (DATA / "n_tfidf_ss").open() as _ss, (
    DATA_PATH / "metadata.csv"
).open() as _g, open(
    "stopwords"
) as _sw:
    print("loading bert")
    _bert_data = json.load(_f)
    SW = set(_sw.read().splitlines())
    print("loading source")
    SS_BERT = dict(
        map(
            lambda line: (  # noqa: WPS407
                line["title"],
                list(
                    filter(
                        lambda w: bool(w) and w not in SW,
                        re.split(
                            r"[^a-z]+",
                            ". ".join(
                                (line["title"], line["abstract"])
                            ).lower(),
                        ),
                    )
                ),
            ),
            DictReader(_g),
        )
    )
    SS_TFIDF = list(
        map(
            lambda ss: list(
                filter(
                    lambda w: bool(w) and w not in SW, re.split(r"[^a-z]+", ss)
                )
            ),
            _ss.read().splitlines(),
        )
    )
    print("loading ys")
    YS = {  # noqa: WPS407
        "bert": list(map(lambda ele: ele["title"], _bert_data)),
        "tfidf": _ys.read().splitlines(),
    }
    print("loading xs")
    XS = {  # noqa: WPS407
        "bert": np.array(
            list(map(lambda ele: ele["scibert"], _bert_data))
        ).reshape((SIZE, -1)),
        "tfidf": np.loadtxt(((DATA / "n_tfidf_xs").as_posix())),
    }
    print("loading xy")
    XY = {  # noqa: WPS407
        "bert": np.loadtxt((DATA / "tsne.txt").as_posix()),
        "tfidf": np.loadtxt(((DATA / "n_tfidf_xy").as_posix())),
    }
    print("Done")


def cluster(n: int, model: str) -> NDArray[int]:
    """Clustering data to `n' cluster."""
    return MiniBatchKMeans(n).fit_predict(XS[model])


def count_it(c: CounterT, kwc: int) -> List[Tuple[str, int]]:
    """Count from Counter."""
    for kw in PKWS:
        c[kw] = 0
    mc = c.most_common(kwc)
    for k, _ in mc:
        PKWS.add(k)
    return mc


@lru_cache(maxsize=2 << 24)
def build_map(model: str, n: int, kwc: int) -> Map:
    """Build `n' clusters `Map'."""
    PKWS.clear()
    fited = cluster(n, model)
    return Map(
        cats=list(map("c-{}".format, range(1, n + 1))),
        kws=list(
            map(
                lambda c: ", ".join(
                    map(
                        lambda x: x[0],
                        count_it(
                            Counter(
                                chain.from_iterable(
                                    map(
                                        lambda ie: model == "bert"
                                        and SS_BERT[YS[model][ie[0]]]
                                        or SS_TFIDF[ie[0]],
                                        filter(
                                            lambda ie: ie[1] == c,
                                            enumerate(fited),
                                        ),
                                    ),
                                )
                            ),
                            kwc,
                        ),
                    )
                ),
                range(n),
            )
        ),
        points=list(
            map(
                lambda y, x_y, x: Point(
                    question=y, x=x_y[0], y=x_y[1], catagory=x,
                ),
                YS[model],
                XY[model],
                fited,
            )
        ),
    )
