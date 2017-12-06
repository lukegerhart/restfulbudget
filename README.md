# money-on-my-mind-and-my-mind-on-my-rest-api-lukegerhart

Name: Luke Gerhart

Pitt ID: lag115

## Installation

1. Create a virtual environment for Python.
2. From the root of the repository run `pip install -r requirements.txt`
3. Add the `FLASK_APP` variable to your path. (e.g. `export FLASK_APP=budget.py`).

## Running the App

Once installed, the application can be started with `flask run`.

## Special Instructions

When run for the first time, there are no categories and no purchases, so the tables will have a header row but no body.

When a category is deleted, the purchases in that category will be permanently marked as uncategorized.

All fields must be filled out when adding a new purchase, except for "What category was it in?". If that category is left blank that purchase will be uncategorized.

Doing anything that results in an error will cause an alert.

Negative amount of money in the "Remaining" column indicates over budget.