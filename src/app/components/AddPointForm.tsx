import { useState } from 'react';
import { MapPin, Anchor, Fuel, AlertTriangle, Ship, X } from 'lucide-react';
import { MapPoint } from '../data/mockData';

interface AddPointFormProps {
  pointType: MapPoint['type'];
  coordinates: [number, number] | null;
  onSave: (point: Omit<MapPoint, 'id'>) => void;
  onCancel: () => void;
}

export function AddPointForm({ pointType, coordinates, onSave, onCancel }: AddPointFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<MapPoint['type']>(pointType);
  const [description, setDescription] = useState('');
  
  // Marina-specific fields
  const [capacity, setCapacity] = useState<number | undefined>();
  const [vhfChannel, setVhfChannel] = useState<number | undefined>();
  const [facilities, setFacilities] = useState<string[]>([]);
  
  // Anchorage-specific fields
  const [depth, setDepth] = useState<number | undefined>();
  const [bottomType, setBottomType] = useState('');
  
  // Fuel-specific fields
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [openingHours, setOpeningHours] = useState('');
  
  // Danger-specific fields
  const [dangerType, setDangerType] = useState('');

  // Don't show form until coordinates are selected
  if (!coordinates) {
    return null;
  }

  const getTypeIcon = (t: MapPoint['type']) => {
    switch (t) {
      case 'marina': return Ship;
      case 'port': return Ship;
      case 'anchorage': return Anchor;
      case 'fuel': return Fuel;
      case 'danger': return AlertTriangle;
      default: return MapPin;
    }
  };

  const getTypeColor = (t: MapPoint['type']) => {
    switch (t) {
      case 'marina': return 'bg-blue-500';
      case 'port': return 'bg-indigo-500';
      case 'anchorage': return 'bg-green-500';
      case 'fuel': return 'bg-orange-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const toggleFacility = (facility: string) => {
    setFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const toggleFuelType = (fuel: string) => {
    setFuelTypes(prev => 
      prev.includes(fuel) 
        ? prev.filter(f => f !== fuel)
        : [...prev, fuel]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a name for the point');
      return;
    }

    const newPoint: Omit<MapPoint, 'id'> = {
      name: name.trim(),
      type,
      lat: coordinates[0],
      lng: coordinates[1],
      description: description.trim() || undefined,
      depth,
      capacity,
      facilities: facilities.length > 0 ? facilities : undefined,
      vhfChannel,
    };

    onSave(newPoint);
  };

  const Icon = getTypeIcon(type);
  const color = getTypeColor(type);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onCancel}>
      <div 
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-slate-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-700"></div>
        
        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className={`flex size-16 shrink-0 items-center justify-center rounded-full ${color}`}>
            <Icon className="size-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">Add New Point</h3>
            <p className="mt-1 text-sm text-slate-400">Tap required fields to continue</p>
          </div>

          <button onClick={onCancel}>
            <X className="size-6 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name - Required */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. South Bay Marina"
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              autoFocus
            />
          </div>

          {/* Type - Can be changed */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MapPoint['type'])}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="marina">Marina</option>
              <option value="port">Port</option>
              <option value="anchorage">Anchorage</option>
              <option value="fuel">Fuel Station</option>
              <option value="danger">Danger Zone</option>
              <option value="custom">Custom Point</option>
            </select>
          </div>

          {/* Coordinates - Auto-filled */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Coordinates</label>
            <div className="rounded-xl bg-slate-800/50 px-4 py-3 font-mono text-sm text-slate-400">
              {coordinates[0].toFixed(6)}°, {coordinates[1].toFixed(6)}°
            </div>
          </div>

          {/* Description - Optional */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description / Notes <span className="text-xs text-slate-500">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Good anchorage in calm weather&#10;Depth ~6m"
              rows={3}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Type-specific fields */}
          {type === 'marina' && (
            <>
              <div className="border-t border-slate-700 pt-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-300">Marina Details</h4>
                
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs text-slate-400">Capacity (berths)</label>
                    <input
                      type="number"
                      value={capacity || ''}
                      onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="120"
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs text-slate-400">VHF Channel</label>
                    <input
                      type="number"
                      value={vhfChannel || ''}
                      onChange={(e) => setVhfChannel(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="9"
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <label className="mb-2 block text-xs text-slate-400">Facilities</label>
                <div className="flex flex-wrap gap-2">
                  {['fuel', 'water', 'electricity', 'wifi', 'shower', 'restaurant', 'repair'].map((facility) => (
                    <button
                      key={facility}
                      onClick={() => toggleFacility(facility)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        facilities.includes(facility)
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === 'anchorage' && (
            <div className="border-t border-slate-700 pt-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-300">Anchorage Details</h4>
              
              <div className="mb-4">
                <label className="mb-2 block text-xs text-slate-400">Depth (meters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={depth || ''}
                  onChange={(e) => setDepth(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="6.5"
                  className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <label className="mb-2 block text-xs text-slate-400">Bottom Type</label>
              <div className="flex flex-wrap gap-2">
                {['sand', 'mud', 'rocks', 'coral'].map((bottom) => (
                  <button
                    key={bottom}
                    onClick={() => setBottomType(bottom)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      bottomType === bottom
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {bottom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'fuel' && (
            <div className="border-t border-slate-700 pt-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-300">Fuel Station Details</h4>
              
              <label className="mb-2 block text-xs text-slate-400">Fuel Types</label>
              <div className="mb-4 flex flex-wrap gap-2">
                {['diesel', 'petrol', 'gas'].map((fuel) => (
                  <button
                    key={fuel}
                    onClick={() => toggleFuelType(fuel)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      fuelTypes.includes(fuel)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">Opening Hours</label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="8:00 - 18:00"
                  className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {type === 'danger' && (
            <div className="border-t border-slate-700 pt-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-300">Danger Details</h4>
              
              <label className="mb-2 block text-xs text-slate-400">Type of Danger</label>
              <div className="flex flex-wrap gap-2">
                {['rocks', 'shallow water', 'reef', 'strong current', 'wreck'].map((danger) => (
                  <button
                    key={danger}
                    onClick={() => setDangerType(danger)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      dangerType === danger
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {danger}
                  </button>
                ))}
              </div>

              {dangerType && (
                <div className="mt-4">
                  <label className="mb-2 block text-xs text-slate-400">Depth (meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={depth || ''}
                    onChange={(e) => setDepth(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1.5"
                    className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-800 py-3 font-semibold text-white transition-colors active:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-colors active:bg-cyan-600"
          >
            Save Point
          </button>
        </div>
      </div>
    </div>
  );
}