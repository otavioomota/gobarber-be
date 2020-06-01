import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

/*
Entity é um decorator que é tipo uma função que passa o que ta abaixo como
parametro, no caso: passa a classe Appointment.

A gente ta indicando que toda vez que a model for salva, atualizada, vai ser
salva na tabela appointments.
*/

/*
  Temos que definir quem é coluna na tabela ou não, pois dentro da model
  podemos ter propriedades abstratas.

  fazemos isso com PrimaryGeneratedColumn, Column .. etc
  por padrão é varchar.
*/
@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  /*
    @ManyToOne(() => User)
    Especifica o tipo do relatiomento e com qual Model está se relacionando.

    JoinColumn({ name: 'provider_id' })
    Especifica qual é a coluna que vai identificar a Model relacionada.
  */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
