import { Router } from 'express';
import { getAllDomains, getDomainBySlug } from '../controllers/domainController';

const router = Router();

router.get('/', getAllDomains);
router.get('/:slug', getDomainBySlug);

export default router;