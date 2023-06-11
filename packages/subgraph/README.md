# Subgraph for Eonian

This is Subgraph package for Eonian yield aggregator.

## Requiremetns

* Docker - required for local testing
* JQ - <https://howtoinstall.co/en/jq> 


## First Start guide

1. Install dependencies

```bash
yarn
```

2. Test subgraph

```bash
yarn test
```

## Known Issues

In case of error `binary-install-raw/bin/0.5.4/binary-linux-20: error while loading shared libraries: libpq.so.5: cannot open shared object file: No such file or directory` during `yarn test` you need to install postgress. [Why it need?](https://thegraph.com/docs/en/developing/unit-testing-framework/).

```bash
sudo apt install postgresql
```

## Local Development

[More info](https://thegraph.academy/developers/local-development/)