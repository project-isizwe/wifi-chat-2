define(function(require) {

    'use strict';

    var _               = require('underscore')
      , Base            = require('app/views/Base')
      , Comments        = require('app/collections/Comments')
      , CommentItemView = require('app/views/Topic/CommentItem')
      , log             = require('app/utils/bows.min')('Views:Topic:CommentList')

    return Base.extend({

      template: _.template(require('text!tpl/Topic/CommentList.html')),

      requiresLogin: true,

      events: {
        'click .js-showMore': 'loadMoreComments'
      },

      initialize: function(options) {
        this.options = options
        this.router = options.router
        this.collection = new Comments(null, {
          node: this.options.node,
          id: this.options.id
        })
        _.bindAll('render')
        this.on('render', this.afterRender, this)
        this.loadComments()
      },

      loadComments: function() {
        this.collection.on('all', function(event) { log('TopicList', event) })
        this.collection.once('loaded:comments', this.initialRender, this)

        this.collection.on('error', function() {
          this.renderComments()
          this.enableLoadMoreButton()
          this.showError('Oh no! Could not load the comments')
        }, this)

        if (0 !== this.collection.length) {
          return this.once('render', this.renderComments, this)
        }
        this.collection.sync()
      },

      initialRender: function() {
        this.renderComments()
        this.collection.on('add', this.renderComments, this)
        this.collection.on('reset', this.renderComments, this)
        this.collection.on('remove', this.renderComments, this)
        this.trigger('loaded:comments')
      },

      enableLoadMoreButton: function() {
        this.$el.find('.js-showMore').attr('disabled', false)
      },

      disableLoadMoreButton: function() {
        this.$el.find('.js-showMore').attr('disabled', 'disabled')
      },

      renderComments: function() {
        var comments = document.createDocumentFragment()
        var self = this

        this.collection.forEach(function(post) {
          var comment = new CommentItemView({
            model: post,
            router: self.router
          })
          comments.appendChild(comment.render().el)
        })
        this.$el.find('[data-role=posts-container]').html(comments)
        this.afterRender()
      },

      afterRender: function() {
        var displayFunction = 'addClass'
        if (this.collection.allItemsLoaded()) {
          displayFunction = 'removeClass'
        }
        var button = this.$el.find('.js-showMore')
        this.enableLoadMoreButton()
        button[displayFunction]('is-hidden')
      },

      loadMoreComments: function() {
        this.disableLoadMoreButton()
        this.collection.sync()
      }
    })

})
