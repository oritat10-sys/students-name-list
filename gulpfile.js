const gulp = require("gulp");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const fs = require("fs");

// ===============================
// Local → GAS
// ===============================

// Convert local CSS → GAS HTML
gulp.task("css-to-gas", function () {
    return gulp.src("*.css") // take all CSS files
        .pipe(replace(/([\s\S]*)/, "<style>\n$1\n</style>"))
        .pipe(rename(function (path) {
            path.extname = ".html"; // change output extension to .html
        }))
        .pipe(gulp.dest("dist"));
});

// Convert local JS → GAS HTML
gulp.task("js-to-gas", function () {
    return gulp.src("script.js")
        .pipe(replace(/([\s\S]*)/, "<script>\n$1\n</script>"))
        .pipe(rename("scripts.html"))
        .pipe(gulp.dest("dist"));
});

// Convert local index.html → GAS (replace <link>/<script> with GAS includes)
gulp.task("html-to-gas", function () {
    return gulp.src("index.html")
        // Replace any CSS link:
        .pipe(replace(
            /<link rel="stylesheet" href="([^"]+)\.css"\s*\/?>/g,
            function (match, p1) {
                return "<?!= include('" + p1 + "'); ?>";
            }
        ))
        // Replace any JS script:
        .pipe(replace(
            /<script src="([^"]+)\.js"><\/script>/g,
            function (match, p1) {
                return "<?!= include('" + p1 + "'); ?>";
            }
        ))
        .pipe(gulp.dest("dist"));
});

// Copy other assets (images, json, etc.)
gulp.task("assets-to-gas", function () {
    return gulp.src([
        "**/*",                     // everything
        "!index.html",              // exclude main index
        "!*.css",                   // exclude raw CSS
        "!script.js",               // exclude raw JS
        "!gulpfile.js",             // exclude gulpfile
        "!package*.json",           // exclude npm files
        "!node_modules/**",         // exclude node_modules
        "!dist/**",                 // exclude dist folder (avoid recursion)
        "!.clasp.json"              // exclude clasp config
    ])
        .pipe(gulp.dest("dist"));
});

// Grouped
gulp.task("to-gas", gulp.series("css-to-gas", "js-to-gas", "html-to-gas", "assets-to-gas"));


// ===============================
// GAS → Local (reverse process)
// ===============================

// Convert GAS styles.html → local styles.css
gulp.task("gas-to-css", function () {
    return gulp.src("dist/*.html") // grab all HTML style files
        .pipe(replace(/<\/?style>/g, "")) // remove <style> tags
        .pipe(rename(function (path) {
            // change `.html` extension → `.css`
            path.extname = ".css";
        }))
        .pipe(gulp.dest("css")); // send them all into css/ folder
});

// Convert GAS scripts.html → local script.js
gulp.task("gas-to-js", function () {
    return gulp.src("dist/scripts.html")
        .pipe(replace(/<\/?script[^>]*>/g, "")) // remove <script> tags
        .pipe(rename("script.js"))
        .pipe(gulp.dest("."));
});

// Convert GAS index.html → local index.html (replace include with <link>/<script>)
gulp.task("gas-to-html", function () {
    return gulp.src("dist/index.html", { allowEmpty: true })
        // Convert style includes back to <link>
        .pipe(replace(
            /<\?!= include$'([^']+)'$; \?>/g,
            function (match, p1) {
                // p1 = filename without extension
                if (p1.match(/\.css$/)) {
                    // if include accidentally has extension
                    return `<link rel="stylesheet" href="${p1}">`;
                }
                // Assume CSS when referenced in <link>
                return `<link rel="stylesheet" href="${p1}.css">`;
            }
        ))
        // Convert script includes back to <script>
        .pipe(replace(
            /<\?!= include$'([^']+)'$; \?>/g,
            function (match, p1) {
                if (p1.match(/\.js$/)) {
                    return `<script src="${p1}"></script>`;
                }
                // Assume JS for plain "scripts", "main", etc.
                return `<script src="${p1}.js"></script>`;
            }
        ))
        .pipe(gulp.dest("."));
});

// Copy other GAS assets
gulp.task("gas-assets-to-local", function () {
    return gulp.src([
        "dist/**/*",
        "!dist/index.html",
        "!dist/styles.html",
        "!dist/scripts.html"
    ]).pipe(gulp.dest("."));
});

// Grouped
gulp.task("to-local", gulp.series("gas-to-css", "gas-to-js", "gas-to-html", "gas-assets-to-local"));




gulp.task("watch", function () {
    gulp.watch(["*.html", "*.css", "*.js"], gulp.series("to-gas"));
});