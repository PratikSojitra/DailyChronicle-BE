import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { NewsletterService } from "./newsletter.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/entities/user.entity";
import { Roles } from "src/decorator/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/guards/roles.guard";
import { CreateNewsletterDto, SubscribeDto, UpdateSubscriberDto } from "./dto/newsletter.dto";

@Controller('newsletters')
@ApiTags('Newsletters')

export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) {}

    @Get()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN,)
    async getAllNewsletters() {
        return this.newsletterService.getAllNewsletters();
    }

    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN,)
    async getNewsletterById(@Param('id') id: string) {
        return this.newsletterService.getNewsletterById(id);
    }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN,)
    async createNewsletter(@Body() createNewsletterDto: CreateNewsletterDto) {
        return this.newsletterService.createNewsletter(createNewsletterDto);
    }

    @Get('subscribers')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN,)
    async getAllSubscribers() {
        return this.newsletterService.getAllSubscribers();
    }

    @Post('subscribe')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    async subscribe(@Body() subscribeDto: SubscribeDto) {
        return this.newsletterService.subscribe(subscribeDto);
    }

    @Put('subscribe/:id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN,)
    async updateSubscriber(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
        return this.newsletterService.updateSubscriber(id, updateSubscriberDto);
    }

    @Delete('subscribe/:id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN,)
    async deleteSubscriber(@Param('id') id: string) {
        return this.newsletterService.deleteSubscriber(id);
    }
}