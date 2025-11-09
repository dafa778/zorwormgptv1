// storage.js - Universal Storage Wrapper untuk Web & APK
// Import file ini di SEMUA halaman HTML sebelum script lainnya

const storage = (() => {
    // In-memory storage sebagai fallback
    const memoryStorage = {};
    
    // Cek apakah localStorage tersedia
    function isLocalStorageAvailable() {
        try {
            if (typeof localStorage === 'undefined' || localStorage === null) {
                return false;
            }
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    const useLocalStorage = isLocalStorageAvailable();
    
    // Jika localStorage tersedia, load semua data ke memory
    if (useLocalStorage) {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                memoryStorage[key] = localStorage.getItem(key);
            }
        } catch (e) {
            console.warn('Error loading localStorage to memory:', e);
        }
    }
    
    return {
        setItem(key, value) {
            // Simpan ke memory
            memoryStorage[key] = value;
            
            // Coba simpan ke localStorage jika tersedia
            if (useLocalStorage) {
                try {
                    localStorage.setItem(key, value);
                } catch (e) {
                    console.warn('localStorage.setItem failed:', e);
                }
            }
        },
        
        getItem(key) {
            // Prioritas: cek memory dulu, lalu localStorage
            if (memoryStorage[key] !== undefined) {
                return memoryStorage[key];
            }
            
            if (useLocalStorage) {
                try {
                    const item = localStorage.getItem(key);
                    if (item !== null) {
                        memoryStorage[key] = item; // Cache ke memory
                        return item;
                    }
                } catch (e) {
                    console.warn('localStorage.getItem failed:', e);
                }
            }
            
            return null;
        },
        
        removeItem(key) {
            // Hapus dari memory
            delete memoryStorage[key];
            
            // Hapus dari localStorage jika tersedia
            if (useLocalStorage) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    console.warn('localStorage.removeItem failed:', e);
                }
            }
        },
        
        clear() {
            // Clear memory
            for (const key in memoryStorage) {
                delete memoryStorage[key];
            }
            
            // Clear localStorage jika tersedia
            if (useLocalStorage) {
                try {
                    localStorage.clear();
                } catch (e) {
                    console.warn('localStorage.clear failed:', e);
                }
            }
        },
        
        // Debug info
        isUsingLocalStorage() {
            return useLocalStorage;
        },
        
        getAllKeys() {
            return Object.keys(memoryStorage);
        }
    };
})();

// Log status untuk debugging
console.log('Storage initialized. Using localStorage:', storage.isUsingLocalStorage());
console.log('Current keys:', storage.getAllKeys());