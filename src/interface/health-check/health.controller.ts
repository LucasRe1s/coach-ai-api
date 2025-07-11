
export class HealthCheckController {
    healthCheck(req: any, res: any) {
        res.status(200).send("OK");
    }
}

export default new HealthCheckController();