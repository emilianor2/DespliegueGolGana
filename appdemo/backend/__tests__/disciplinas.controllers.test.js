jest.mock('../config/db', () => ({
  query: (_sql, callback) => callback(null, [{ id: 1, nombre: 'Futbol' }])
}));

const { getDisciplinas } = require('../controllers/disciplinas.controllers');

test('getDisciplinas returns list of disciplinas', () => {
  const req = {};
  const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  getDisciplinas(req, res);
  expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Futbol' }]);
});
