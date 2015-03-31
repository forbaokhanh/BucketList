Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('goals'); }
  // loads the posts data into the client's side once - the first time you load the page, afterwards it remebers shit
});

GoalsListController = RouteController.extend({
  template: 'goalsList',
  increment: 8, 
  goalsLimit: function() { 
    return parseInt(this.params.goalsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.goalsLimit()};
  },
  subscriptions: function() {
    this.goalsSub = Meteor.subscribe('goals', this.findOptions());
  },
  goals: function() {
    return Goals.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.goals().count() === this.goalsLimit();
    return {
      goals: this.goals(),
      ready: this.goalsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

BestGoalsController = GoalsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestGoals.path({goalsLimit: this.goalsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: BestGoalsController
});

Router.route('/submit', {
  name: 'goalSubmit'
});

Router.route('/best/:goalsLimit?', {name: 'bestGoals'});