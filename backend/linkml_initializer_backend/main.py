from pathlib import Path
import shutil
from uuid import uuid4
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from linkml.workspaces.cli import new_workspace

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

TEMPLATE_DIRECTORY = Path(__file__).parent / "../../linkml-project-template"


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/ws")
async def generate_workspace(params: WorkspaceParameters):
    id = uuid4()
    target = OUTPUT_DIRECTORY / str(id)
    new_workspace(
        name=params.name,
        description=params.description,
        organization="",
        author=params.author,
        directory=target,
        template_directory=str(TEMPLATE_DIRECTORY),
        template_version=None,
        force=False,
    )
    shutil.make_archive(target, 'zip', target)
    shutil.rmtree(target)
    return FileResponse(f'{target}.zip', filename=f'{params.name}.zip')
