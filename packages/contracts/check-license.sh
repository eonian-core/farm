#!/bin/bash

# solhint doesn't support license header validation
# as a result we need to implement custom check

folder_path="src"

required_first_line="// SPDX-License-Identifier: AGPL-3.0-or-later"

all_files_start_same_line=true

while IFS= read -r file; do
    # skip markdown files
    if [[ "${file}" == *.sol ]]; then
        # check first line
        first_line=$(head -n 1 "${file}")
        if [ "${first_line}" != "${required_first_line}" ]; then

            echo "Incorrect license used in file ${file}, found ${first_line}, must use ${required_first_line}"
            all_files_start_same_line=false

            break
        fi
    fi
done < <(find "${folder_path}" -type f)

if $all_files_start_same_line; then
    echo "All contracts have same license."
    exit 0
else
    echo "Incorrect license used in some contracts, must use ${required_first_line}"
    exit 1
fi