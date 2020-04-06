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
from pathlib import Path

# DataBase
from elasticsearch import Elasticsearch

# Others
from tqdm import tqdm

# Config
from config import DEFAULT_STR
from config import INDEX_NAME as INDEX
from config import JSONS

# Types
from typing import Dict, Generator, Tuple

DONE = set()
TOTAL_DOCS = 52097


def _check(doc: Tuple[str, str]) -> bool:
    """Check if doc in `DONE' set."""
    if doc in DONE:
        return False
    DONE.add(doc)
    return True


def index(es: Elasticsearch, body: Dict[str, str]) -> None:
    """Index the `body' content."""
    es.index(index=INDEX, doc_type="doc", body=body)


def read_json(path: Path) -> Generator[Tuple[str, str], None, None]:
    """Read json from `path' to get title and para body."""
    with path.open() as f:
        yield from (
            lambda doc: map(
                lambda text: (
                    doc.get("metadata", {}).get("title", DEFAULT_STR),
                    text.get("text", DEFAULT_STR),
                ),
                doc.get("body_text"),
            )
        )(json.load(f))


def build() -> None:
    """Build the index into Elasticsearch."""
    es = Elasticsearch()
    es.indices.exists(INDEX) and es.indices.delete(INDEX)  # noqa: WPS428

    qbar = tqdm(JSONS, total=TOTAL_DOCS, desc="Indexing", unit="doc")

    for path in qbar:
        for title, text in filter(_check, read_json(path)):
            qbar.set_description(f"Indexing '{title[:40]}...'")  # noqa: WPS432
            index(es, {"title": title, "content": text})

    es.indices.refresh(INDEX)


if __name__ == "__main__":
    build()
