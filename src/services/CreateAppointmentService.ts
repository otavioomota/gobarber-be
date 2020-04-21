import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// DTO
interface Request {
  provider_id: string;
  date: Date;
}

/*
  Aqui utilizamos o D do SOLID que é o Dependency Inversion principle
  que é utilizar a mesma instancia. No caso é  appointmentRepository.
*/

class CreateAppoitmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    /*
      O getCustomRepository(repositorio) faz a "conexão" com o repositorio
      importado.
      ex: const appointmentsRepository = getCustomRepository(AppointmentsRepository);
      no caso, o appointmentsRepository tem acesso à todas as funções do repositorio

    */
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    // Dispara um erro para o try catch;
    if (findAppointmentInSameDate) {
      throw new Error('This appointment is already booked');
    }

    // O método create só cria uma instancia, ele não salva no db.
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // salva instancia no db.
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppoitmentService;
