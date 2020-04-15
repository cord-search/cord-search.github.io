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
date     : Apr  5, 2020
email    : Nasy <nasyxx+python@gmail.com>
filename : es_search.py
project  : backend
license  : GPL-3.0+

At pick'd leisure
  Which shall be shortly, single I'll resolve you,
Which to you shall seem probable, of every
  These happen'd accidents
                          -- The Tempest
"""
# Standard Library
from itertools import cycle

# DataBase
from elasticsearch import Elasticsearch

# Config
from config import IDX_DETAIL, IDX_FULL, RETURN_SIZE

# Types
from module import Docs, DocSOut, DocSOutWithFT
from typing import Dict, Union

es = Elasticsearch()

DD = Dict[str, Dict[str, str]]


def _paper_id(hit: DD) -> str:
    """Get paper_id from `hit'."""
    return hit["_source"]["paper_id"]


def _title(hit: DD) -> str:
    """Get title from `hit'."""
    return hit["_source"]["title"]


def build_doc(hit: DD, index: str, key: str) -> Union[DocSOut, DocSOutWithFT]:
    """Build doc."""
    src = hit["_source"]
    if index in {IDX_DETAIL, IDX_FULL}:
        return DocSOut(
            paper_id=_paper_id(hit), title=_title(hit), text=src[key],
        )
    return DocSOutWithFT(
        paper_id=_paper_id(hit),
        title=_title(hit),
        text=": ".join((src["ft_name"], src[key])),
        raw_text=src[key],
        name=src["ft_name"],
    )


async def search(
    index: str, key: str, query: str, return_size: int = 0
) -> Docs:
    """Search the `query' stc in full text `key'."""
    return (
        lambda hits: Docs(
            total=hits["total"]["value"],
            docs=list(
                map(build_doc, hits["hits"], cycle((index,)), cycle((key,)))
            ),
        )
    )(
        es.search(
            index=index,
            body={
                "track_total_hits": True,
                "size": return_size or RETURN_SIZE,
                "query": {"match": {key: query}},
            },
        )["hits"]
    )
