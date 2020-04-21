import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

/*
  1) Cria um decorator e passa a model utilizada pelo repositorio
      ex: @EntityRepository(Appointment)
  2 ) dar um extends no Repository para herdar as funções de acesso ao db
  */
@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  /*
    1) removeu o array pois os dados serão persistidos/recuperados do db
    2) removeu o all e create pois o typeorm já fornece essas funções.


  */

  /*
    Toda função que é asyc/await retorna uma promise.
      ex: Promise<Appointment | null>
      Retorno Promise do tipo appointment ou null.
  */
  public async findByDate(date: Date): Promise<Appointment | null> {
    // const findAppointment = this.appointments.find(appointment =>
    //   isEqual(date, appointment.date),
    // );

    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
