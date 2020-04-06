#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Standard Library
from pathlib import Path

DATA_PATH = Path("../data/CORD-19-research-challenge")
JSONS = DATA_PATH.glob("**/*/*.json")

INDEX_NAME = "cord"
RETURN_SIZE = 100
DEFAULT_STR = ""
