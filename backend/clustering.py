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
from functools import lru_cache

# Others
import numpy as np
import ujson as json
from nptyping import NDArray
from sklearn.cluster import MiniBatchKMeans

# Config
from config import DATA

# Types
from typing import Dict, List, Union

with (DATA / "scibert_embeddings.json").open() as f:
    YS = list(map(lambda ele: ele["title"], json.load(f)))

XS = np.loadtxt((DATA / "tsne.txt").as_posix())


def cluster(n: int, tsne_data: NDArray[float]) -> NDArray[int]:
    """Clustering data to `n' cluster."""
    return MiniBatchKMeans(n).fit_predict(tsne_data)


@lru_cache(maxsize=2 << 24)
def build_json(n: int) -> List[Dict[str, Union[str, float]]]:
    """Build `n' clusters json."""
    return list(
        map(
            lambda y, xy, x: {
                "question": y,
                "x": xy[0],
                "y": xy[1],
                "catagory": x,
            },
            YS,
            XS,
            cluster(n, XS),
        )
    )
