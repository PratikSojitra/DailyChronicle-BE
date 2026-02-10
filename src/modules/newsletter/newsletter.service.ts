import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Newsletter } from 'src/entities/newsletter.entity';
import { Subscriber } from 'src/entities/subscriber.entity';
import { Repository } from 'typeorm';
import {
  CreateNewsletterDto,
  SubscribeDto,
  UpdateSubscriberDto,
} from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter)
    private readonly newsletterRepository: Repository<Newsletter>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  public async getAllNewsletters() {
    const newsletters = await this.newsletterRepository.find({
      relations: ['posts', 'subscribers'],
    });
    return newsletters;
  }

  public async getNewsletterById(id: string) {
    const newsletter = await this.newsletterRepository.findOne({
      where: { id },
      relations: ['posts', 'subscribers'],
    });
    if (!newsletter) {
      throw new NotFoundException('Newsletter not found');
    }
    return newsletter;
  }

  public async createNewsletter(createNewsletterDto: CreateNewsletterDto) {
    const subscribers = await this.subscriberRepository.find({
      where: { isActive: true },
    });
    const createNewsletterPayload = {
      ...createNewsletterDto,
      subscribers: subscribers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newsletter = this.newsletterRepository.create(
      createNewsletterPayload,
    );
    return this.newsletterRepository.save(newsletter);
  }

  public async deleteNewsletter(id: string) {
    const newsletter = await this.newsletterRepository.findOne({
      where: { id },
    });
    if (!newsletter) {
      throw new NotFoundException('Newsletter not found');
    }
    return this.newsletterRepository.delete(newsletter);
  }

  public async getAllSubscribers() {
    const subscribers = await this.subscriberRepository.find();
    return subscribers;
  }

  public async getSubscriberById(id: string) {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });
    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }
    return subscriber;
  }

  public async subscribe(subscribeDto: SubscribeDto) {
    const subscribers = await this.subscriberRepository.findOne({
      where: { email: subscribeDto.email },
    });
    if (subscribers) {
      const payload = {
        ...subscribeDto,
        updatedAt: new Date(),
      };
      return this.subscriberRepository.update(subscribers.id, payload);
    }
    const createSubscriberPayload = {
      ...subscribeDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const subscriber = this.subscriberRepository.create(
      createSubscriberPayload,
    );
    return this.subscriberRepository.save(subscriber);
  }

  public async updateSubscriber(
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
  ) {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });
    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }
    const payload = {
      ...updateSubscriberDto,
      updatedAt: new Date(),
    };
    return this.subscriberRepository.update(subscriber.id, payload);
  }

  public async deleteSubscriber(id: string) {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });
    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }
    return this.subscriberRepository.delete(subscriber.id);
  }
}
