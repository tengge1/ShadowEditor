import { Control, UI } from '../third_party';

/**
 * Article
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Article(options = {}) {
    Control.call(this, options);
}

Article.prototype = Object.create(Control.prototype);
Article.prototype.constructor = Article;

Article.prototype.render = function () {
    this.renderDom(this.createElement('article'));
};

UI.addXType('article', Article);

export default Article;