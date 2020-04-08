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
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import UJSONResponse

# Others
from es_search import search

# Config
from config import (
    DEFAULT_QUERY,
    IDX_DETAIL,
    IDX_FT,
    IDX_FULL,
    IDXS,
    MAX_RETURN_SIZE
)

# Types
from module import Docs, DocSOutWithFT

ANY = "*"
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ANY],
    allow_credentials=True,
    allow_methods=[ANY],
    allow_headers=[ANY],
)


@app.get("/index/full/", response_model=Docs)
async def index_full_handle(
    key: str = Query("abstract", regex="^(abstract|body_text)$"),
    query: str = DEFAULT_QUERY,
    return_size: int = Query(100, ge=0, le=MAX_RETURN_SIZE),
) -> UJSONResponse:
    """Handle full text index query."""
    return await search(IDX_FULL, key, query, return_size)


@app.get("/index/detail/", response_model=Docs)
async def index_detail_handle(
    query: str = DEFAULT_QUERY,
    return_size: int = Query(100, ge=0, le=MAX_RETURN_SIZE),
) -> UJSONResponse:
    """Handle detail index query."""
    return await search(IDX_DETAIL, "text", query, return_size)


@app.get("/index/ft/", response_model=Docs)
async def index_figure_table_handle(
    query: str = DEFAULT_QUERY,
    return_size: int = Query(100, ge=0, le=MAX_RETURN_SIZE),
) -> UJSONResponse:
    """Handle figure and table query."""
    return await search(IDX_FT, "ft_text", query, return_size)


@app.get("/index/tp/", response_model=Docs)
async def index_title_paper_id_handle(
    index: str = Query(IDX_FULL, regex=f"^({'|'.join(IDXS)})$"),
    key: str = Query("title", regex=f"^(title|paper_id)$"),
    query: str = DEFAULT_QUERY,
    return_size: int = Query(100, ge=0, le=MAX_RETURN_SIZE),
) -> UJSONResponse:
    """Handle title and paper_id query."""
    return await search(index, key, query, return_size)
