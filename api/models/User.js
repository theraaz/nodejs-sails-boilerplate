/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {
    firstName: {
      type: 'STRING'
    },
    lastName: {
      type: 'STRING'
    },
    email: {
      type: 'STRING',
      required: true,
      unique: true
    },
    password: {
      type: 'STRING',
      required: true
    },
    statusId: {
      type: 'INTEGER',
      defaultsTo: 1
    },
    isDeleted: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
    lastLogin: {
      'type': 'DATETIME',
      defaultsTo: new Date()
    },
    toJSON: function () {
      let obj = this.toObject();
      delete obj.password;
      delete obj.statusId;
      delete obj.isDeleted;
      return obj;
    },

    validatePassword: function (attemptedPassword) {
      let self = this;
      return new Promise((resolve, reject)=>{
        bcrypt.compare(attemptedPassword, self.password, (err, result)=>{
          if(err)return reject(err);
          resolve(result);
        });
      })
    }
  },

  beforeCreate: function (user, cb) {

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function () {
      }, function (err, hash) {
        user.password = hash;
        cb(null, user);
      });
    });
  },

  beforeUpdate: function (user, cb) {
    if('password' in user){
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function () {
        }, function (err, hash) {
          user.password = hash;
          cb(null, user);
        });
      });
    }else cb(null, user);
  }
};
