import React, { useContext, useEffect } from 'react';
import { TagTypeContext, SelectedTypeContext, SelectedTagContext } from './RecipeSearch.jsx';



const TypeDropdown = () => {



  const [tagTypes, setTagTypes] = useContext(TagTypeContext);

  const [selectedType, setSelectedType] = useContext(SelectedTypeContext);


  const [selectedTag, setSelectedTag] = useContext(SelectedTagContext);

  const mappedTypeArray = Object.keys(tagTypes).map((type) => ({
    type,
    tags: tagTypes[type]
  }));

  useEffect(() => {
    setSelectedTag('');
  }, [selectedType]);

  return (
    <div>
      <div>
        <label htmlFor="type" style={{marginRight: "10px"}}>select type:</label>
        <select name="type" id="type" onChange={(e)=>{setSelectedType(e.target.value);}}>
          {mappedTypeArray.map((item, index) => <option value={index}>{item.type}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="tag" style={{marginRight: "20px", marginTop: "10px"}}>select tag:</label>
        {selectedType !== -1 ? (
          <select name="tag" id="tag" onChange={(e)=>{setSelectedTag(e.target.value)}} value={selectedTag}>
            <option value={''}>none</option>
            {mappedTypeArray[selectedType].tags.map((tag, index) => <option value={tag.name}>{tag.display_name}</option>)}
          </select>)
        :  (<select name="tag" id="tag" onChange={(e)=>{setSelectedTag(e.target.value)}} value={selectedTag} disabled>
        <option value={''}>none</option>
      </select>)}
      </div>
    </div>
  )
}

export default TypeDropdown;