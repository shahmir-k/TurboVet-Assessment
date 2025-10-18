import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Organization } from './entities';
import { RoleType } from '@org/data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // Check if data already exists
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    // Create organizations
    const parentOrg = this.organizationRepository.create({
      name: 'TurboVet HQ',
      parentId: null,
    });
    await this.organizationRepository.save(parentOrg);

    const childOrg = this.organizationRepository.create({
      name: 'TurboVet Branch Office',
      parentId: parentOrg.id,
    });
    await this.organizationRepository.save(childOrg);

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const owner = this.userRepository.create({
      email: 'owner@turbovet.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Owner',
      roleType: RoleType.OWNER,
      organizationId: parentOrg.id,
    });
    await this.userRepository.save(owner);

    const admin = this.userRepository.create({
      email: 'admin@turbovet.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Admin',
      roleType: RoleType.ADMIN,
      organizationId: childOrg.id,
    });
    await this.userRepository.save(admin);

    const viewer = this.userRepository.create({
      email: 'viewer@turbovet.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Viewer',
      roleType: RoleType.VIEWER,
      organizationId: childOrg.id,
    });
    await this.userRepository.save(viewer);

    console.log('✅ Database seeded successfully!');
    console.log('Test Users:');
    console.log('  Owner: owner@turbovet.com / password123');
    console.log('  Admin: admin@turbovet.com / password123');
    console.log('  Viewer: viewer@turbovet.com / password123');
  }
}

