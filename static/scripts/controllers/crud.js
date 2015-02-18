var Users = require('../collections/users');
var React = require('react');
var BackboneReactComponent = require('backbone-react-component');
var $ = require('jquery');
var _ = require('underscore');

/**
 * The basic structure of a CRUD controller. Includes create, edit and list pages for modifying a database table.
 */
module.exports = (function () {
    var users = new Users();

    var UserForm = React.createClass({
        handleSubmit: function (e) {
            e.preventDefault();
            var firstName = this.refs.first_name.getDOMNode().value.trim();
            var lastName = this.refs.last_name.getDOMNode().value.trim();
            var email = this.refs.email.getDOMNode().value.trim();
            var country = this.refs.country.getDOMNode().value.trim();

            if (!firstName || !lastName || !email || !country) {
                return;
            }

            users.create({
                first_name: firstName,
                last_name: lastName,
                email: email,
                country: country
            });

            this.refs.first_name.getDOMNode().value = '';
            this.refs.last_name.getDOMNode().value = '';
            this.refs.email.getDOMNode().value = '';
            this.refs.country.getDOMNode().value = '';
        },
        render: function () {
            return (
                <form className="bearForm" onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Yogi" ref="first_name" />
                    <input type="text" placeholder="Bear" ref="last_name" />
                    <input type="text" placeholder="yogi.bear@gmail.com" ref="email" />
                    <input type="text" placeholder="USA" ref="country" />
                    <input type="submit" value="Post" />
                </form>
            );
        }
    });

    return {
        list: function () {
            users.fetch();

            var Table = React.createClass({
                mixins: [BackboneReactComponent],
                render: function () {
                    var idAttribute = this.props['id-attribute'];
                    var collection = this.props.collection;
                    var columns = this.props.columns.map(function (column) {
                        if (_(column).isString()) {
                            column = { name: column, label: column };
                        }

                        return column;
                    });

                    var tableRows = collection.map(function (item) {
                        return (
                            <TableRow key={item[idAttribute]} id={item[idAttribute]} data={item} columns={columns} />
                        );
                    });

                    var headerRows = columns.map(function (column) {
                        var key = column.name + '_header';

                        return (
                            <th key={key}>{column.label}</th>
                        );
                    });

                    return (
                        <table className="table table-hover">
                            <thead>{headerRows}</thead>
                            <tbody>{tableRows}</tbody>
                            <tfoot></tfoot>
                        </table>
                    );
                }
            });

            var TableRow = React.createClass({
                render: function () {
                    var rowData = this.props.data;
                    var columns = this.props.columns;
                    var id = this.props.id;

                    var tableCells = _(columns).map(function (column) {
                        var value = rowData[column.name];
                        var key = column.name + "_" + id;

                        return (
                            <td key={key}>{value}</td>
                        );
                    });

                    return (
                        <tr>{tableCells}</tr>
                    );
                }
            });

            /**
             * render my components in the DOM
             */
            // TODO: shouldn't have to use jQuery
            $(function () {
                // TODO: should pass an array of objects { key: "_id", label: "id" }
                var columns = [
                    {
                        name: "_id",
                        label: "id"
                    },
                    'first_name',
                    'last_name',
                    'email',
                    'country'
                ];

                React.render(
                    <Table collection={users} columns={columns} id-attribute={users.model.prototype.idAttribute}/>,
                    document.getElementById('main')
                );
            });
        },
        create: function () {
            /**
             * render my components in the DOM
             */
            // TODO: shouldn't have to use jQuery
            $(function () {
                React.render(
                    <UserForm />,
                    document.getElementById('main')
                );
            });
        },
        edit: function (id) {
            var user = users.get(id);

            /**
             * render my components in the DOM
             */
            // TODO: shouldn't have to use jQuery
            // TODO: need to make sure form is populated for editing
            $(function () {
                React.render(
                    <UserForm model={user}/>,
                    document.getElementById('main')
                );
            });
        }
    }
})();
