jest.mock('../config/db', () => ({ query: jest.fn() }));
const { createReserva } = require('../controllers/reservas.controllers');

describe('createReserva', () => {
  it('returns 400 if body fields are missing', () => {
    const req = { usuario: { id: 1 }, body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    createReserva(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
