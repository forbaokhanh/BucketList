// Fixture data 
if (Goals.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var tomId = Meteor.users.insert({
    profile: { name: 'Tom Coleman' }
  });

  var tom = Meteor.users.findOne(tomId);

  var sachaId = Meteor.users.insert({
    profile: { name: 'Sacha Greif' }
  });

  var sacha = Meteor.users.findOne(sachaId);

  var telescopeId = Goals.insert({
    title: 'Introducing Telescope',
    userId: sacha._id,
    author: sacha.profile.name,
    commentsCount: 2,
    upvoters: [], 
    votes: 0,
    itemListsCount: 0,
    itemLists: []
  });

  Goals.insert({
    title: 'Meteor',
    userId: tom._id,
    author: tom.profile.name,
    commentsCount: 0,
    upvoters: [], 
    votes: 0,
    itemListsCount: 0,
    itemLists: []
  });

  Goals.insert({
    title: 'The Meteor Book',
    userId: tom._id,
    author: tom.profile.name,
    commentsCount: 0,
    upvoters: [], 
    votes: 0,
    itemListsCount: 0,
    itemLists: []
  });

  for (var i = 0; i < 10; i++) {
    Goals.insert({
      title: 'Test post #' + i,
      author: sacha.profile.name,
      userId: sacha._id,
      commentsCount: 0,
      upvoters: [], 
      votes: 0,
      itemListsCount: 0,
      itemLists: []
    });
  }
}
