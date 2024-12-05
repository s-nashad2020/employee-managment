const Employee = require("../models/employee");

module.exports = {
  Query: {
    listEmployees: async (_, { filter, pagination, sort }) => {
      const query = filter ? { ...filter } : {};
      const options = {
        limit: pagination?.limit || 10,
        skip: pagination ? (pagination.page - 1) * pagination.limit : 0,
        sort: sort ? { [sort.field]: sort.order === "ASC" ? 1 : -1 } : {},
      };
      return Employee.find(query, null, options);
    },
    getEmployee: async (_, { id }) => {
      return Employee.findById(id);
    },
  },
  Mutation: {
    addEmployee: async (_, { input }) => {
      const newEmployee = new Employee(input);
      return newEmployee.save();
    },
    updateEmployee: async (_, { id, input }) => {
      return Employee.findByIdAndUpdate(id, input, { new: true });
    },
  },
};
