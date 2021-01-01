const handleProfileGet = async (req, res, db) => {
  const { id } = req.params;
  try {
    const user = await db.select('*').from('users').where({ id });
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('Not found');
    }
  } catch (err) {
    res.status(400).json('error getting user');
  }
};

const handleProfileUpdate = async (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;

  try {
    const response = await db
      .select('*')
      .from('users')
      .where({ id })
      .update({ name, age, pet });

    if (response) {
      res.json('success');
    } else {
      res.status(400).json('Unable to update');
    }
  } catch (err) {
    res.status(400).json('error updating user');
  }
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
};
