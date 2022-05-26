from __future__ import annotations
from datetime import datetime, date
from enum import Enum
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from pydantic.dataclasses import dataclass

metamodel_version = "None"
version = "None"

# Pydantic config and validators
class PydanticConfig:
    """ Pydantic config https://pydantic-docs.helpmanual.io/usage/model_config/ """

    validate_assignment = True
    validate_all = True
    underscore_attrs_are_private = True
    extra = 'forbid'
    arbitrary_types_allowed = True  # TODO re-evaluate this


@dataclass(config=PydanticConfig)
class WorkspaceParameters:
    
    name: str = Field(None)
    description: Optional[str] = Field(None)
    author: str = Field(None)
    



# Update forward refs
# see https://pydantic-docs.helpmanual.io/usage/postponed_annotations/
WorkspaceParameters.__pydantic_model__.update_forward_refs()

