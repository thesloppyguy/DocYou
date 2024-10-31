

class InitValidateAPI(Resource):
    def get(self):
        init_status = get_init_validate_status()
        if init_status:
            return {"status": "finished"}
        return {"status": "not_started"}

    @only_edition_self_hosted
    def post(self):
        # is tenant created
        tenant_count = TenantService.get_tenant_count()
        if tenant_count > 0:
            raise AlreadySetupError()

        parser = reqparse.RequestParser()
        parser.add_argument("password", type=StrLen(30),
                            required=True, location="json")
        input_password = parser.parse_args()["password"]

        if input_password != os.environ.get("INIT_PASSWORD"):
            session["is_init_validated"] = False
            raise InitValidateFailedError()

        session["is_init_validated"] = True
        return {"result": "success"}, 201
