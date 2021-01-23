module.exports = {
    module: {
        rules: [
            {
                test: /\.s[ac]aa$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    }
}