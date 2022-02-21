# Access via repl:

```bash
lein repl  ## from somewhere within the `backend` directory
```

```clojure-repl
(require '[swlkup.db.state :refer [db_ctx]])  ;; get a database context
(require '[clojure.pprint :refer [pprint]])

;; This example queries all supervisors
(pprint ((:q db_ctx) '{:find [(pull ?e [*])]
                       :where [[?e :xt/spec :swlkup.model.supervisor/doc]]}))
```

To learn more about the datalog query syntax, please use the [XTDB language reference](https://docs.xtdb.com/language-reference/datalog-queries/).


# Web UI

If you are looking for a Web UI for inspecting the XTDB database, you may want use [XTDB inspector](https://github.com/tatut/xtdb-inspector).

It is a separate project and not bundled into swlkup. To connect to your database, you will need to adjust `dev-src/user.clj`.
