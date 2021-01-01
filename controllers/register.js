const handleRegister = async (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);
  try {
    await db.transaction(async (trx) => {
      const loginEmail = await trx
        .insert({
          hash: hash,
          email: email,
        })
        .into('login')
        .returning('email');

      const user = await trx('users').returning('*').insert({
        email: loginEmail[0],
        name: name,
        joined: new Date(),
      });

      res.json(user[0]);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json('unable to register');
  }
};

module.exports = {
  handleRegister: handleRegister,
};
