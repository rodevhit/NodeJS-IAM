const Sequelize = require('sequelize');
const db = require('../helpers/db');

const masterUser = db.define('master_user', {
    // attributes
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    user_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
        validate: {
            min: 2,
            max: 4
        },
        comment: '1->admin, 2->pm, 3->im, 4->client'
    },
    parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    user_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1->active, 0->inactive'
    }
}, {
    // options
    timestamps: false,
    freezeTableName: true,
});

module.exports = masterUser;
