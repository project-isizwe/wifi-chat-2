define(function (require) {
  
  'use strict';

  var $                 = require('jquery')
    , Backbone          = require('backbone')
    , LoginView         = require('app/views/Login')
    , RulesView         = require('app/views/Rules')
    , SignupView        = require('app/views/Signup')
    , PasswordResetView = require('app/views/PasswordReset')
    , NewPasswordView   = require('app/views/NewPassword')
    , LogoutView        = require('app/views/Logout')
    , HomeView          = require('app/views/Home')
    , ModalView         = require('app/views/Modal')
    , log               = require('app/utils/bows.min')('Router')
        
    return Backbone.Router.extend({

      el: $('body'),
    
      loggedIn: false, 
      
      routes: {
        '': 'showHome',
        'login': 'showLogin',
        'signup': 'showSignup',
        'password/reset': 'showPasswordReset',
        'password/reset/:token': 'showNewPassword',
        'rules': 'showRules',
        'channel/:jid': 'channelContent',
        'profile/:jid': 'userProfile',
        'logout': 'showLogout'
      },
      
      initialize: function() {
        log('Application initialized')
      },
      
      showModal: function() {
        var modalView = new ModalView({ router: this })
        this.showView(modalView, '/modal')
      },
      
      showLogin: function(jid, password) {
        var loginView = new LoginView({
          router: this,
          jid: jid,
          password: password
        })
        this.showView(loginView, '/login')
      },
      
      showRules: function(hideExtras) {
        var rulesView = new RulesView({ router: this, hideExtras: hideExtras })
        this.showView(rulesView, '/rules')  
      },
      
      showSignup: function() {
        var signupView = new SignupView({ router: this })
        this.showView(signupView, '/signup')
      },

      showPasswordReset: function() {
        var passwordResetView = new PasswordResetView({ router: this })
        this.showView(passwordResetView, '/password/reset')
      },
      
      showNewPassword: function(token) {
        var newPasswordView = new NewPasswordView({ router: this, token: token })
        this.showView(newPasswordView, '/password/reset/' + token)
      },
      
      showHome: function() {
        var homeView = new HomeView({ router: this })
        this.showView(homeView, '')
      },
      
      performLogout: function() {
        var logoutView = new LogoutView({ router: this })
        this.showView(logoutView, '/logout')
      },
      
      showView: function(view, url) {
        this.closeView()
        view.delegateEvents()

        window.document.title = view.title
        if (view.requiresLogin && !this.loggedIn) {
          return this.showLogin()
        }
        this.navigate(url)
        this.currentView = view

        this.el.html(view.el)
        view.delegateEvents()
        view.render()
      },
      
      closeView: function() {
        if (!this.currentView) return
        this.currentView.closeView()
      },
      
      setLoggedIn: function() {
        this.loggedIn = true
        return this
      },
      
      isLoggedIn: function() {
        log('User is' + (this.loggedIn ? ' ' : 'n\'t ') + 'logged in')
        if (!this.loggedIn) {
          log("is logged in, so lets go")
          this.showLogin()
        }
        return true
      }
    })

})