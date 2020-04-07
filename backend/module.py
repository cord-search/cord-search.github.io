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
date     : Apr  6, 2020
email    : Nasy <nasyxx+python@gmail.com>
filename : typ.py
project  : backend
license  : GPL-3.0+

At pick'd leisure
  Which shall be shortly, single I'll resolve you,
Which to you shall seem probable, of every
  These happen'd accidents
                          -- The Tempest
"""

# Others
from pydantic import BaseModel

# Types
from typing import Dict, List, Union


class Ref(BaseModel):
    """Ref module."""

    name: str
    text: str


class Doc(BaseModel):
    """Document Module."""

    paper_id: str
    title: str
    abstract: List[str]
    body_text: List[str]
    figure: List[Ref]
    table: List[Ref]


class DocSOut(BaseModel):
    """Document Simple Output Module."""

    paper_id: str
    title: str
    text: str


class DocSOutWithFT(DocSOut):
    """Document Simple Output Module with Figure and Table."""

    paper_id: str
    title: str
    text: str
    name: str


class DocOut(BaseModel):
    """Document Complete Output Module."""

    paper_id: str
    title: str
    abstract: str
    body_text: str
    figure: List[Ref]
    table: List[Ref]


class Docs(BaseModel):
    """Docs Module."""

    total: int
    docs: List[Union[DocSOut, DocSOutWithFT, DocOut]]
