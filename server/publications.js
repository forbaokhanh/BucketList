// Meteor.publish('goals', function(options) {
//   check(options, {
//     // sort: Object,
//     limit: Number
//   });
//   console.log(Goals.find({}, options));
//   return Goals.find({}, options);
// });

Meteor.publish('goals', function() {
  return Goals.find(); 
});