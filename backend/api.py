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
filename : api.py
project  : backend
license  : GPL-3.0+

At pick'd leisure
  Which shall be shortly, single I'll resolve you,
Which to you shall seem probable, of every
  These happen'd accidents
                          -- The Tempest
"""
# Http
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Others
from es_search import search

# Config
from config import INDEX_NAME as INDEX

ANY = "*"
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ANY],
    allow_credentials=True,
    allow_methods=[ANY],
    allow_headers=[ANY],
)


@app.get(f"/{INDEX}/")
async def query_handle(query: str = "") -> JSONResponse:
    """Handle default index query."""
    return await search(query)
