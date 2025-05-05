/**
 * History Manager
 * Manages canvas drawing history with enhanced undo/redo functionality for AI operations
 */
class HistoryManager {
  constructor(maxHistory = 30) {
    this.history = [];
    this.currentStep = -1;
    this.maxHistory = maxHistory;
    this.actionLabels = []; // Track type of actions for smart grouping
    this.groupedOperations = false; // Whether operations should be grouped
    this.lastOperationTime = 0; // Timestamp of last operation for timing-based grouping
    this.operationGroupTimeThreshold = 500; // Time threshold for grouping operations (ms)
  }

  /**
   * Add new history record
   * @param {HTMLCanvasElement} canvas Current canvas element
   * @param {string} actionType Type of action performed (draw, erase, aiEffect, etc.)
   * @param {Object} metadata Additional data about the action
   */
  addToHistory(canvas, actionType = 'draw', metadata = {}) {
    // If we're not at the end of history, remove all future history
    if (this.currentStep < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentStep + 1);
      this.actionLabels = this.actionLabels.slice(0, this.currentStep + 1);
    }
    
    try {
      // Create canvas snapshot
      const snapshot = canvas.toDataURL('image/png');
      const currentTime = Date.now();
      
      // Check if we should group with previous operation
      const shouldGroup = this._shouldGroupWithPrevious(actionType, currentTime);
      
      if (shouldGroup && this.currentStep >= 0) {
        // Replace the last snapshot instead of adding a new one
        this.history[this.currentStep] = snapshot;
        // Update metadata in the action label
        this.actionLabels[this.currentStep].count = 
          (this.actionLabels[this.currentStep].count || 1) + 1;
        this.actionLabels[this.currentStep].lastUpdated = currentTime;
        
        if (metadata.aiOperation) {
          this.actionLabels[this.currentStep].aiOperation = metadata.aiOperation;
        }
      } else {
        // Add to history as a new step
        this.history.push(snapshot);
        this.actionLabels.push({
          type: actionType,
          count: 1,
          timestamp: currentTime,
          lastUpdated: currentTime,
          ...metadata
        });
        
        // If history exceeds max limit, remove oldest records
        if (this.history.length > this.maxHistory) {
          this.history.shift();
          this.actionLabels.shift();
        }
        
        // Update current step
        this.currentStep = this.history.length - 1;
      }
      
      this.lastOperationTime = currentTime;
    } catch (error) {
      console.error('Cannot save Canvas state', error);
      // We can either:
      // 1. Continue but without history (user can't undo)
      // 2. Try to create a temporary hidden canvas to save state
      // Here we just log the error and continue
    }
  }

  /**
   * Undo operation
   * @param {HTMLCanvasElement} canvas Current canvas element
   * @param {boolean} smartUndo Whether to perform smart undo (group similar actions)
   * @returns {Object} Status and info about the undo operation
   */
  undo(canvas, smartUndo = true) {
    if (this.currentStep > 0) {
      // Standard undo - go back one step
      this.currentStep--;
      
      // Smart undo - if enabled and we have similar actions grouped together, undo them all
      if (smartUndo && this.currentStep > 0) {
        const currentType = this.actionLabels[this.currentStep + 1].type;
        
        // For AI operations, always do a single undo to have more control
        if (!this.actionLabels[this.currentStep + 1].aiOperation) {
          // Continue undoing if previous actions are of the same type
          while (
            this.currentStep > 0 && 
            this.actionLabels[this.currentStep].type === currentType &&
            // Don't group across AI operations
            !this.actionLabels[this.currentStep].aiOperation
          ) {
            this.currentStep--;
          }
        }
      }
      
      this._restoreSnapshot(canvas, this.history[this.currentStep]);
      
      return { 
        success: true, 
        actionType: this.actionLabels[this.currentStep].type,
        isAIOperation: !!this.actionLabels[this.currentStep].aiOperation 
      };
    }
    return { success: false };
  }

  /**
   * Redo operation
   * @param {HTMLCanvasElement} canvas Current canvas element
   * @param {boolean} smartRedo Whether to perform smart redo (group similar actions)
   * @returns {Object} Status and info about the redo operation
   */
  redo(canvas, smartRedo = true) {
    if (this.currentStep < this.history.length - 1) {
      // Standard redo - go forward one step
      this.currentStep++;
      
      // Smart redo - if enabled and we have similar actions grouped together, redo them all
      if (smartRedo && this.currentStep < this.history.length - 1) {
        const currentType = this.actionLabels[this.currentStep].type;
        
        // For AI operations, always do a single redo to have more control
        if (!this.actionLabels[this.currentStep].aiOperation) {
          // Continue redoing if next actions are of the same type
          while (
            this.currentStep < this.history.length - 1 && 
            this.actionLabels[this.currentStep + 1].type === currentType &&
            // Don't group across AI operations
            !this.actionLabels[this.currentStep + 1].aiOperation
          ) {
            this.currentStep++;
          }
        }
      }
      
      this._restoreSnapshot(canvas, this.history[this.currentStep]);
      
      return { 
        success: true, 
        actionType: this.actionLabels[this.currentStep].type,
        isAIOperation: !!this.actionLabels[this.currentStep].aiOperation
      };
    }
    return { success: false };
  }

  /**
   * Check if undo is available
   * @returns {boolean} Whether undo is available
   */
  canUndo() {
    return this.currentStep > 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean} Whether redo is available
   */
  canRedo() {
    return this.currentStep < this.history.length - 1;
  }

  /**
   * Get information about the current state and available operations
   * @returns {Object} History state information
   */
  getHistoryState() {
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      historyLength: this.history.length,
      currentStep: this.currentStep,
      lastActionType: this.currentStep >= 0 ? this.actionLabels[this.currentStep].type : null,
      isLastActionAI: this.currentStep >= 0 ? !!this.actionLabels[this.currentStep].aiOperation : false,
      totalSteps: this.history.length
    };
  }

  /**
   * Set grouping behavior for operations
   * @param {boolean} enableGrouping Whether to group similar operations
   * @param {number} timeThreshold Time threshold in ms for grouping operations
   */
  setGroupingBehavior(enableGrouping, timeThreshold = 500) {
    this.groupedOperations = enableGrouping;
    this.operationGroupTimeThreshold = timeThreshold;
  }

  /**
   * Clear history
   */
  clear() {
    this.history = [];
    this.actionLabels = [];
    this.currentStep = -1;
    this.lastOperationTime = 0;
  }

  /**
   * Save a named checkpoint that can be returned to
   * @param {string} name Checkpoint name
   * @returns {number} Checkpoint index
   */
  saveCheckpoint(name) {
    if (this.currentStep >= 0) {
      this.actionLabels[this.currentStep].checkpoint = name;
      return this.currentStep;
    }
    return -1;
  }

  /**
   * Restore to a named checkpoint
   * @param {HTMLCanvasElement} canvas Current canvas element
   * @param {string} name Checkpoint name to restore
   * @returns {boolean} Whether restoration was successful
   */
  restoreCheckpoint(canvas, name) {
    const checkpointIndex = this.actionLabels.findIndex(label => label.checkpoint === name);
    if (checkpointIndex >= 0) {
      this.currentStep = checkpointIndex;
      this._restoreSnapshot(canvas, this.history[this.currentStep]);
      return true;
    }
    return false;
  }

  /**
   * Add a new AI operation to history
   * @param {HTMLCanvasElement} canvas Current canvas element
   * @param {string} operationType Type of AI operation
   * @param {Object} parameters Parameters of the operation
   */
  addAIOperation(canvas, operationType, parameters = {}) {
    // AI operations are always added as discrete steps (never grouped)
    this.addToHistory(canvas, operationType, { 
      aiOperation: true,
      parameters
    });
  }

  /**
   * Determine if the current operation should be grouped with the previous one
   * @param {string} actionType Type of current action
   * @param {number} currentTime Current timestamp
   * @returns {boolean} Whether to group with previous operation
   * @private
   */
  _shouldGroupWithPrevious(actionType, currentTime) {
    if (!this.groupedOperations || this.currentStep < 0) {
      return false;
    }
    
    const lastAction = this.actionLabels[this.currentStep];
    
    // Don't group if types don't match
    if (lastAction.type !== actionType) {
      return false;
    }
    
    // Don't group with AI operations
    if (lastAction.aiOperation) {
      return false;
    }
    
    // Check if within time threshold
    return (currentTime - this.lastOperationTime) < this.operationGroupTimeThreshold;
  }

  /**
   * Restore snapshot to canvas
   * @param {HTMLCanvasElement} canvas Target canvas element
   * @param {string} snapshot Image snapshot (Data URL)
   * @private
   */
  _restoreSnapshot(canvas, snapshot) {
    const context = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Draw history state
      context.drawImage(img, 0, 0);
    };
    
    img.src = snapshot;
  }
}

export default HistoryManager; 