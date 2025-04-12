    //jshint esversion:6

    const express = require("express");
    const bodyParser = require("body-parser");
    const ejs = require("ejs");
    const mongoose = require('mongoose');

    const app = express();

    app.use(express.json());
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));

    main()
    async function main() {
        try {
            await mongoose.connect("mongodb+srv://abhkb777:test123@cluster0.ojbznhp.mongodb.net/wikiDB",
                { useNewUrlParser: true }, { useUnifiedTopology: true });

            const articleSchema = new mongoose.Schema({
                title: String,
                content: String
            });

            const Article = mongoose.model("Article", articleSchema);

            /////////////////////// Request Targetting All Articles ///////////////////////////////////////////////////////////////////////////////

            app.route("/articles")

                .get(function (req, res) {
                    Article.find({}).then((foundArticles) => {
                        res.send(foundArticles);
                    }, (err) => {
                        res.send(err);
                    }
                    );
                })

                .post(function (req, res) {

                    const newarticle = new Article({
                        title: req.body.title,
                        content: req.body.content
                    });
                    newarticle.save().then(() => {
                        res.send("Successfully added a new article.");
                    }, (err) => {
                        res.send(err);
                    }
                    );
                })

                .delete(function (req, res) {
                    Article.deleteMany({}).then(() => {
                        res.send("Successfully deleted all articles.");
                    }, (err) => {
                        res.send(err);
                    }
                    );
                });

            /////////////////////// Request Targetting A Specific Article ///////////////////////////////////////////////////////////////////////////////

            app.route("/articles/:articleTitle")

                .get(function (req, res) {
                    Article.findOne({ title: req.params.articleTitle }).then((foundArticle) => {
                        if (foundArticle) {
                            res.send(foundArticle);
                        } else {
                            res.send("No articles matching that title was found")
                        }
                    }, (err) => {
                        res.send(err);
                    }
                    );
                })

                .put(function (req, res) {
                    async () => {
                        try {
                            await Article.updateOne(
                                { title: req.params.articleTitle },
                                {title: req.body.title,
                        content: req.body.content},
                                { overwrite: true }
                            ).then(() => {
                                res.send("Successfully updated article");
                            }, (err) => {
                                res.send(err);
                            });
                        }catch(e) { console.log(e.message) }
                    }
                })

                .patch(function (req, res) {
                    // async () => {
                    //     try { await 
                            Article.updateOne(
                                { title: req.params.articleTitle },
                                {$set: req.body}
                            ).then(() => {
                                res.send("Successfully updated the selected article");
                            }, (err) => {
                                res.send(err);
                            });
                    // }catch(e) { console.log(e.message) }
                    }
                )

                .delete(function (req, res) {
                    Article.deleteOne(
                        { title: req.params.articleTitle }
                    ).then(() => {
                        res.send("Successfully deleted the correspinding article");
                    }, (err) => {
                        res.send(err);
                    });
                });


            app.listen(3000, function () {
                console.log("Server started on port 3000");
            });

        } catch (err) {
            console.log(err);    
        } finally {

        }
    }
