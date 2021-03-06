dev-backend: backend/linkml_initializer_backend/workspace.py
	cd backend; poetry run uvicorn linkml_initializer_backend.main:app --reload 

dev-frontend: frontend/src/schema.json
	cd frontend; npm run dev

backend/linkml_initializer_backend/workspace.py: schema/workspace.yaml
	cd backend; poetry run gen-pydantic ../$< > ../$@

frontend/src/schema.json: schema/workspace.yaml
	cd backend; poetry run gen-json-schema --closed ../$< > ../$@
