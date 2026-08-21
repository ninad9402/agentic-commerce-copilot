import { StoreDataset, GrowthOpportunity, AgentThought, DraftedCampaignAsset } from '../types/ecommerce';
import { generateCampaignAssets } from './assetGenerator';

export interface AgentExecutionState {
  status: 'idle' | 'analyzing' | 'drafting' | 'awaiting_approval' | 'approved' | 'executing' | 'completed';
  currentOpportunity?: GrowthOpportunity;
  thoughts: AgentThought[];
  draftedAssets: DraftedCampaignAsset[];
}

export class ECommerceGrowthAgent {
  private dataset: StoreDataset;
  private apiKey?: string;
  private apiProvider?: 'openai' | 'gemini';

  constructor(dataset: StoreDataset, apiKey?: string, apiProvider?: 'openai' | 'gemini') {
    this.dataset = dataset;
    this.apiKey = apiKey;
    this.apiProvider = apiProvider;
  }

  public async runExperiment(
    opportunity: GrowthOpportunity,
    onThoughtUpdate?: (thoughts: AgentThought[]) => void,
    onStateChange?: (state: AgentExecutionState) => void
  ): Promise<AgentExecutionState> {
    const thoughts: AgentThought[] = [];

    const addThought = (
      phase: AgentThought['phase'],
      message: string,
      toolInvoked?: string,
      details?: Record<string, any>
    ) => {
      const thought: AgentThought = {
        id: `thought-${Date.now()}-${thoughts.length}`,
        timestamp: new Date().toLocaleTimeString(),
        phase,
        message,
        toolInvoked,
        details,
      };
      thoughts.push(thought);
      if (onThoughtUpdate) onThoughtUpdate([...thoughts]);
    };

    // Step 1: Analyze opportunity & store segment
    addThought('analysis', `Initiating Autonomous Growth Agent for target opportunity: "${opportunity.title}"`);
    await new Promise(r => setTimeout(r, 600));

    addThought(
      'planning',
      `Querying store database for target customer segment: ${opportunity.targetAudienceCount} users identified.`,
      'segmentation_filter',
      { targetSegment: opportunity.suggestedAction }
    );
    await new Promise(r => setTimeout(r, 800));

    // Step 2: Tool Call - Asset Generation
    addThought(
      'tool_call',
      `Executing AI tool 'generate_multichannel_campaign_assets' via ${this.apiKey ? 'OpenAI GPT-4o' : 'Built-in Copilot Engine'}`,
      'generate_multichannel_campaign_assets'
    );
    await new Promise(r => setTimeout(r, 1000));

    const assets = await generateCampaignAssets({
      opportunity,
      dataset: this.dataset,
      apiKey: this.apiKey,
      apiProvider: this.apiProvider,
    });

    addThought(
      'drafting',
      `Successfully generated ${assets.length} assets (HTML Email Series, SMS Alert, Shopify Discount Code).`
    );
    await new Promise(r => setTimeout(r, 700));

    // Step 3: Human Guardrail Pause
    addThought(
      'approval_required',
      `⚠️ HUMAN GUARDRAIL PAUSE: Drafted assets require merchant review and approval before external publishing or dispatch.`,
      'human_approval_gate'
    );

    const finalState: AgentExecutionState = {
      status: 'awaiting_approval',
      currentOpportunity: opportunity,
      thoughts,
      draftedAssets: assets,
    };

    if (onStateChange) onStateChange(finalState);
    return finalState;
  }
}
