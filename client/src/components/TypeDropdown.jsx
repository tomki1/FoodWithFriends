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
      <h2>Dropdown</h2>
      <label htmlFor="type">Choose a type:</label>
      <select name="type" id="type" onChange={(e)=>{setSelectedType(e.target.value);}}>
        {mappedTypeArray.map((item, index) => <option value={index}>{item.type}</option>)}
      </select>
      <label htmlFor="tag">Choose a tag:</label>
      {selectedType >= 0 ? (
        <select name="tag" id="tag" onChange={(e)=>{setSelectedTag(e.target.value)}} value={selectedTag}>
          <option value={''}>none</option>
          {mappedTypeArray[selectedType].tags.map((tag, index) => <option value={tag.name}>{tag.display_name}</option>)}
        </select>)
      :  null}


    </div>
  )
}

export default TypeDropdown;