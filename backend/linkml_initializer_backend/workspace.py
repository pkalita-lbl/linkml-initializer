from __future__ import annotations
from datetime import datetime, date
from enum import Enum
from typing import List, Dict, Optional, Any
from pydantic import BaseModel as BaseModel, Field

metamodel_version = "None"
version = "None"

class WeakRefShimBaseModel(BaseModel):
   __slots__ = '__weakref__'
    
class ConfiguredBaseModel(WeakRefShimBaseModel,
                validate_assignment = True, 
                validate_all = True, 
                underscore_attrs_are_private = True, 
                extra = 'forbid', 
                arbitrary_types_allowed = True):
    pass                    


class Licenses(str, Enum):
    
    MIT = "MIT"
    BSD_3 = "BSD-3"
    GNU_GPL_v3FULL_STOP0 = "GNU GPL v3.0"
    Apache_Software_License_2FULL_STOP0 = "Apache Software License 2.0"
    
    

class WorkspaceParameters(ConfiguredBaseModel):
    
    project_name: str = Field(None)
    github_org: str = Field(None)
    project_description: Optional[str] = Field(None)
    full_name: str = Field(None)
    email: str = Field(None)
    license: Licenses = Field(None)
    project_schema: Optional[str] = Field(None)
    



# Update forward refs
# see https://pydantic-docs.helpmanual.io/usage/postponed_annotations/
WorkspaceParameters.update_forward_refs()

