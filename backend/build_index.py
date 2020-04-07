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
date     : Apr  4, 2020
email    : Nasy <nasyxx+python@gmail.com>
filename : build_index.py
project  : backend
license  : GPL-3.0+

At pick'd leisure
  Which shall be shortly, single I'll resolve you,
Which to you shall seem probable, of every
  These happen'd accidents
                          -- The Tempest
"""
# Standard Library
import json
from concurrent.futures import ThreadPoolExecutor as Pool
from itertools import chain, cycle
from pathlib import Path

# DataBase
from elasticsearch import Elasticsearch

# Others
from tqdm import tqdm

# Config
from config import IDX_DETAIL, IDX_FT, IDX_FULL, IDXS, JSONS

# Types
from module import Doc, Ref
from typing import Dict, Iterable, List, Tuple

BODY = Tuple[
    Dict[str, str], Tuple[Dict[str, str], ...], Tuple[Dict[str, str], ...],
]

TOTAL_DOCS = 52097
TITLE = "title"
PID = "paper_id"

es = Elasticsearch()


def _text(fields: Iterable[Dict[str, str]]) -> List[str]:
    """Get text from field."""
    return list(map(lambda field: field["text"], fields))


def _ref(refs: Dict[str, Dict[str, str]], name: str) -> List[Ref]:
    """Build Ref from ref name."""
    return list(
        map(
            lambda kv: Ref(name=kv[0], text=kv[1]["text"]),
            filter(lambda kv: kv[0].startswith(name), refs.items()),
        )
    )


def _get(
    key: str, doc: Dict[str, List[Dict[str, str]]]
) -> List[Dict[str, str]]:
    """Get key from doc."""
    return doc.get(key, [])


def concat(paras: Iterable[str]) -> str:
    """Concat all of the paragraphs."""
    return "\n".join(paras)


def index_it(index: str, body: Dict[str, str]) -> None:
    """Index the `body' content."""
    es.index(index=index, doc_type="doc", body=body)


def read_json(path: Path) -> Doc:
    """Read json from `path' to get title and para body."""
    with path.open() as f:
        return (
            lambda doc: Doc(
                paper_id=doc[PID],
                title=doc["metadata"][TITLE],
                abstract=_text(_get("abstract", doc)),
                body_text=_text(_get("body_text", doc)),
                figure=_ref(doc["ref_entries"], "FIGREF"),
                table=_ref(doc["ref_entries"], "TABREF"),
            )
        )(json.load(f))


def to_body(path: Path) -> BODY:
    """Path to body."""
    return (
        lambda doc: (
            {
                PID: doc.paper_id,
                TITLE: doc.title,
                "abstract": concat(doc.abstract),
                "body_text": concat(doc.body_text),
            },
            tuple(
                map(
                    lambda text: {
                        PID: doc.paper_id,
                        TITLE: doc.title,
                        "text": text,
                    },
                    doc.body_text,
                )
            ),
            tuple(
                map(
                    lambda ft: {
                        PID: doc.paper_id,
                        TITLE: doc.title,
                        "ft_text": ft.text,
                        "ft_name": ft.name,
                    },
                    chain(doc.figure, doc.table),
                )
            ),
        )
    )(read_json(path))


def runner(path: Path, pbar: tqdm) -> None:
    """Run index it."""
    body, para_bodys, ft_bodys = to_body(path)

    title = (
        lambda text: len(text) == 40 and f"{text}...." or text  # noqa: WPS432
    )(
        body["title"][:40]  # noqa: WPS432
    ).strip()[
        :-1
    ]

    pbar.set_description(f"Indexing '{title}'", refresh=False)

    index_it(
        IDX_FULL, body,
    )
    for para_body in para_bodys:
        index_it(
            IDX_DETAIL, para_body,
        )
    for ft_body in ft_bodys:
        index_it(
            IDX_FT, ft_body,
        )

    pbar.set_description(f"Indexed '{title}'", refresh=False)
    pbar.update()


def delete_old() -> None:
    """Delete old data."""
    for i in IDXS:
        if es.indices.exists(i):
            es.indices.delete(i)


def refresh() -> None:
    """Refresh indexs."""
    for i in IDXS:
        es.indices.refresh(i)


def build() -> None:
    """Build the index into Elasticsearch."""
    pbar = tqdm(total=TOTAL_DOCS, desc="Indexing", unit="doc", mininterval=1)
    with Pool() as pool:
        pool.map(runner, JSONS, cycle((pbar,)))


if __name__ == "__main__":
    delete_old()
    build()
    refresh()
