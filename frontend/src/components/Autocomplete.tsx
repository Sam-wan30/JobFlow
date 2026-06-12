import React, { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { MapPin, Building2, X } from 'lucide-react';

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type: 'location' | 'company';
  className?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

// Common cities for location autocomplete
const CITIES = [
  // Indian cities
  'Bangalore', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
  'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
  'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
  'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad', 'Bareilly', 'Moradabad',
  'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem',
  'Warangal', 'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Guntur',
  'Amravati', 'Bikaner', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi',
  'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur',
  // International cities
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus',
  'Fort Worth', 'Indianapolis', 'Charlotte', 'Seattle', 'Denver', 'Washington', 'Boston',
  'El Paso', 'Nashville', 'Detroit', 'Portland', 'Memphis', 'Oklahoma City', 'Las Vegas',
  'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
  'Kansas City', 'Mesa', 'Atlanta', 'Long Beach', 'Colorado Springs', 'Raleigh', 'Miami',
  'Oakland', 'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita', 'Arlington', 'New Orleans',
  'Bakersfield', 'Tampa', 'Honolulu', 'Anaheim', 'Aurora', 'Santa Ana', 'Riverside',
  'Corpus Christi', 'Lexington', 'Stockton', 'St. Louis', 'Saint Paul', 'Henderson',
  'Pittsburgh', 'Cincinnati', 'Anchorage', 'Greensboro', 'Plano', 'Newark', 'Lincoln',
  'Orlando', 'Irvine', 'Toledo', 'Jersey City', 'Chula Vista', 'Durham', 'Fort Wayne',
  'St. Petersburg', 'Laredo', 'Buffalo', 'Madison', 'Lubbock', 'Chandler', 'Glendale',
  'Scottsdale', 'Reno', 'Norfolk', 'Winston-Salem', 'North Las Vegas', 'Gilbert', 'Chesapeake',
  'Irving', 'Hialeah', 'Garland', 'Fremont', 'Richmond', 'Boise', 'Baton Rouge',
  'London', 'Paris', 'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Vienna', 'Prague', 'Warsaw',
  'Budapest', 'Athens', 'Lisbon', 'Dublin', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki',
  'Zurich', 'Geneva', 'Brussels', 'Barcelona', 'Milan', 'Munich', 'Hamburg', 'Frankfurt',
  'Tokyo', 'Seoul', 'Beijing', 'Shanghai', 'Hong Kong', 'Singapore', 'Sydney', 'Melbourne',
  'Toronto', 'Vancouver', 'Montreal', 'Dubai', 'Abu Dhabi', 'Doha', 'Riyadh', 'Jeddah',
  'Tel Aviv', 'Istanbul', 'Mexico City', 'Sao Paulo', 'Buenos Aires', 'Santiago', 'Lima',
  'Bogota', 'Cape Town', 'Johannesburg', 'Nairobi', 'Lagos', 'Cairo', 'Mumbai', 'Bangkok',
  'Jakarta', 'Kuala Lumpur', 'Manila', 'Ho Chi Minh City', 'Hanoi', 'Taipei',
];

// Common companies for company autocomplete
const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta (Facebook)', 'Netflix',
  'Tesla', 'NVIDIA', 'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel',
  'AMD', 'Qualcomm', 'Cisco', 'VMware', 'SAP', 'Zoom', 'Slack', 'Atlassian',
  'Stripe', 'Square', 'PayPal', 'Shopify', 'Square', 'Airbnb', 'Uber', 'Lyft',
  'DoorDash', 'Instacart', 'Robinhood', 'Coinbase', 'Stripe', 'Plaid',
  'Twilio', 'SendGrid', 'Mailchimp', 'HubSpot', 'Marketo', 'Salesforce',
  'ServiceNow', 'Workday', 'Tableau', 'Looker', 'Snowflake', 'Databricks',
  'Palantir', 'Anduril', 'SpaceX', 'Blue Origin', 'NASA', 'Lockheed Martin',
  'Boeing', 'Raytheon', 'Northrop Grumman', 'General Dynamics',
  'JPMorgan Chase', 'Goldman Sachs', 'Morgan Stanley', 'BlackRock', 'Fidelity',
  'Capital One', 'Bank of America', 'Wells Fargo', 'Citi', 'HSBC',
  'Procter & Gamble', 'Unilever', 'Nestle', 'Coca-Cola', 'PepsiCo',
  'McDonalds', 'Starbucks', 'Nike', 'Adidas', 'Under Armour',
  'Walmart', 'Target', 'Costco', 'Amazon', 'Best Buy', 'Home Depot',
  'Lowe`s', 'IKEA', 'Wayfair', 'Overstock', 'Etsy', 'Shopify',
  'Ford', 'General Motors', 'Toyota', 'Honda', 'Volkswagen', 'BMW',
  'Mercedes-Benz', 'Tesla', 'Rivian', 'Lucid Motors', 'BYD',
  'ExxonMobil', 'Chevron', 'Shell', 'BP', 'Total', 'ConocoPhillips',
  'Johnson & Johnson', 'Pfizer', 'Moderna', 'AstraZeneca', 'Gilead',
  'UnitedHealth', 'Anthem', 'Cigna', 'Humana', 'CVS Health',
  'AT&T', 'Verizon', 'T-Mobile', 'Comcast', 'Charter', 'Dish Network',
  'Disney', 'Warner Bros', 'Universal', 'Sony', 'Paramount', 'Netflix',
  'Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Pandora',
  'TikTok', 'Snapchat', 'Pinterest', 'Reddit', 'Twitter/X', 'LinkedIn',
  'Dropbox', 'Box', 'WeWork', 'Regus', 'Servcorp',
  'Squarespace', 'Wix', 'WordPress', 'Shopify', 'BigCommerce',
  'Mailchimp', 'Constant Contact', 'SendinBlue', 'ActiveCampaign',
  'HubSpot', 'Salesforce', 'Marketo', 'Pardot', 'Eloqua',
];

const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  type,
  className = '',
  disabled = false,
  inputRef: externalInputRef,
  onKeyDown: externalOnKeyDown,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  
  // Use external ref if provided, otherwise use internal ref
  const inputRef = externalInputRef || internalInputRef;

  const dataSource = type === 'location' ? CITIES : COMPANIES;
  const icon = type === 'location' ? MapPin : Building2;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = dataSource.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
    } else {
      setSuggestions([]);
    }
  }, [value, dataSource]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Call external onKeyDown if provided
    if (externalOnKeyDown) {
      externalOnKeyDown(e);
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          onChange(suggestions[highlightedIndex]);
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const Icon = icon;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(value.length > 0)}
          placeholder={placeholder}
          disabled={disabled}
          className="block w-full rounded-lg border border-slate-300 bg-white pl-9 pr-8 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          aria-autocomplete="list"
          aria-controls={`${type}-listbox`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={`${type}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-base shadow-lg sm:text-sm"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              role="option"
              aria-selected={highlightedIndex === index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`cursor-pointer px-3 py-2 text-slate-900 hover:bg-slate-100 transition-colors ${
                highlightedIndex === index ? 'bg-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-slate-400" />
                <span>{suggestion}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
