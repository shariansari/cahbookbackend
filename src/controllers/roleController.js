const Role = require('../models/Role');

class RoleController {
  async createRole(req, res) {
    try {
      const role = new Role(req.body);
      await role.save();
      res.status(200).json({
        success: true,
        message: "role created successfully",
        statusCode: 201,
        data: role
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async searchRole(req, res) {
    try {
      const options = {
        page: parseInt(req.body.page) || 1,
        limit: parseInt(req.body.limit) || 10,
        sort: req.body.sort || { createdAt: -1 },
        select: req.body.select || ""
      };
      const roles = await Role.paginate(req.body.search, options);
      res.json({ statusCode: 200, data: roles });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }

      const role = await Role.findByIdAndUpdate(_id, req.body, { new: true });
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json({ statusCode: 200, data: role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRole(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }
      const role = await Role.findByIdAndDelete(_id);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json({ statusCode: 200, message: 'Role deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getHealth(req, res) {
    res.json({ status: 'healthy', service: 'role-service' });
  }
}

module.exports = new RoleController();
