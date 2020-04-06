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
# DataBase
from elasticsearch import Elasticsearch

# Config
from config import INDEX_NAME as INDEX
from config import RETURN_SIZE

# Types
from typ import QRY_TYP

ES = Elasticsearch()


async def search(query: str) -> QRY_TYP:
    """Search the `query' str from elasticsearch."""
    return (
        lambda hits: {
            "total": hits["total"],
            "results": list(
                map(
                    lambda hit: {
                        "title": hit["_source"]["title"],
                        "content": hit["_source"]["content"],
                    },
                    hits["hits"],
                )
            ),
        }
    )(
        ES.search(
            index=INDEX,
            body={"size": RETURN_SIZE, "query": {"match": {"content": query}}},
        )["hits"]
    )
