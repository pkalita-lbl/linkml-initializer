from pathlib import Path
import shutil
from uuid import uuid4

from cookiecutter.main import cookiecutter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from linkml_initializer_backend.workspace import WorkspaceParameters

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

OUTPUT_DIRECTORY = Path(__file__).parent / "../../output"
OUTPUT_DIRECTORY.mkdir(exist_ok=True, parents=True)

TEMPLATE_DIRECTORY = Path(__file__).parent / "../../linkml-project-cookiecutter"


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/ws")
async def generate_workspace(params: WorkspaceParameters):
    id = uuid4()
    target = OUTPUT_DIRECTORY / str(id)
    cookiecutter(
        template=str(TEMPLATE_DIRECTORY),
        no_input=True,
        output_dir=target,
        extra_context=params.__dict__
    )
    shutil.make_archive(target, 'zip', target)
    shutil.rmtree(target)
    return FileResponse(f'{target}.zip', filename=f'{params.project_name}.zip')
