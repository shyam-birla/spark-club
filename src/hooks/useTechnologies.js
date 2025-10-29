// src/hooks/useTechnologies.js
import { useState, useEffect, useCallback } from 'react';
import { client } from '../../sanity/lib/client'; // Adjust path as needed
import { toast } from 'react-hot-toast';

const useTechnologies = (initialSelectedTechnologies = []) => {
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);
  const [technologySearchQuery, setTechnologySearchQuery] = useState('');
  const [showAddTechnologyForm, setShowAddTechnologyForm] = useState(false);
  const [newTechnologyName, setNewTechnologyName] = useState('');
  const [newTechnologyLogo, setNewTechnologyLogo] = useState(null);
  const [newTechnologyLogoPreview, setNewTechnologyLogoPreview] = useState(null);
  const [savingNewTechnology, setSavingNewTechnology] = useState(false);
  const [showTechnologyList, setShowTechnologyList] = useState(false);

  useEffect(() => {
    client.fetch(`*[_type == "technology"]{_id, name, "logoUrl": logo.asset->url}`).then(techs => {
      setAllTechnologies(techs);
      setFilteredTechnologies(techs);
    });
  }, []);

  useEffect(() => {
    setFilteredTechnologies(
      allTechnologies.filter(tech =>
        tech.name.toLowerCase().includes(technologySearchQuery.toLowerCase())
      )
    );
  }, [technologySearchQuery, allTechnologies]);

  const handleTechnologySearch = useCallback((query) => {
    setTechnologySearchQuery(query);
    setShowTechnologyList(query.length > 0);
  }, []);

  const handleNewTechnologyNameChange = useCallback((name) => {
    setNewTechnologyName(name);
  }, []);

  const handleNewTechnologyLogoChange = useCallback((file) => {
    setNewTechnologyLogo(file);
    if (file) {
      setNewTechnologyLogoPreview(URL.createObjectURL(file));
    } else {
      setNewTechnologyLogoPreview(null);
    }
  }, []);

  const clearNewTechnologyLogo = useCallback(() => {
    setNewTechnologyLogo(null);
    setNewTechnologyLogoPreview(null);
  }, []);

  const handleAddTechnology = useCallback(async (onTechnologyAdded) => {
    if (!newTechnologyName.trim()) {
      toast.error('Technology name is required.');
      return;
    }
    setSavingNewTechnology(true);
    try {
      let logoAsset = null;
      if (newTechnologyLogo) {
        logoAsset = await client.assets.upload('image', newTechnologyLogo);
      }
      const newTech = {
        _type: 'technology',
        name: newTechnologyName.trim(),
        logo: logoAsset ? { _type: 'image', asset: { _type: 'reference', _ref: logoAsset._id } } : undefined,
      };
      const createdTech = await client.create(newTech);
      toast.success(`Technology '${createdTech.name}' added!`);
      setAllTechnologies(prev => [...prev, createdTech]);
      onTechnologyAdded(createdTech._id); // Callback to update form data in parent
      setNewTechnologyName('');
      setNewTechnologyLogo(null);
      setNewTechnologyLogoPreview(null);
      setShowAddTechnologyForm(false);
      setTechnologySearchQuery(''); // Clear search query after adding new tech
    } catch (error) {
      console.error('Failed to add new technology:', error);
      toast.error('Failed to add technology. Please try again.');
    } finally {
      setSavingNewTechnology(false);
    }
  }, [newTechnologyName, newTechnologyLogo]);

  return {
    allTechnologies,
    filteredTechnologies,
    technologySearchQuery,
    showAddTechnologyForm,
    newTechnologyName,
    newTechnologyLogoPreview,
    savingNewTechnology,
    showTechnologyList,
    setShowTechnologyList,
    setShowAddTechnologyForm,
    handleTechnologySearch,
    handleNewTechnologyNameChange,
    handleNewTechnologyLogoChange,
    clearNewTechnologyLogo,
    handleAddTechnology,
  };
};

export default useTechnologies;
