import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '../utils/ThemeContext';
import { useAppStore } from '../store/appStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ProblemStatement, CATEGORIES, DIFFICULTY_LEVELS } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
  category: yup.string().required('Category is required'),
  difficulty: yup.string().required('Difficulty level is required'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
});

interface FormData {
  title: string;
  category: string;
  difficulty: string;
  description: string;
}

export const SubmitProblemScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user, addProblem } = useAppStore();
  const [constraints, setConstraints] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [urgent, setUrgent] = useState(false);
  const [constraintInput, setConstraintInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const addConstraint = () => {
    if (constraintInput.trim()) {
      setConstraints([...constraints, constraintInput.trim()]);
      setConstraintInput('');
    }
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        setFiles([...files, result.assets[0]]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!user) {
      Alert.alert('Error', 'Please login to submit a problem');
      return;
    }

    const newProblem: ProblemStatement = {
      id: Date.now().toString(),
      title: data.title,
      category: data.category,
      difficulty: data.difficulty as any,
      description: data.description,
      constraints,
      requirements,
      tags,
      urgent,
      status: 'pending',
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      fileUrls: files.map((f) => f.uri),
    };

    addProblem(newProblem);
    Alert.alert('Success', 'Problem submitted successfully!');
    
    // Reset form
    reset();
    setConstraints([]);
    setRequirements([]);
    setTags([]);
    setUrgent(false);
    setFiles([]);
    
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={[styles.header, { color: colors.text }]}>
          Submit Problem Statement
        </Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Problem Title *"
              placeholder="Enter a clear and concise title"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.title?.message}
            />
          )}
        />

        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: value === cat ? colors.primary : colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => onChange(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: value === cat ? '#FFF' : colors.text },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.category && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.category.message}
            </Text>
          )}
        </View>

        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            Difficulty Level *
          </Text>
          <Controller
            control={control}
            name="difficulty"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.chipContainer, { gap: 8 }]}>
                {DIFFICULTY_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: value === level ? colors.secondary : colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => onChange(level)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: value === level ? '#FFF' : colors.text },
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.difficulty && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.difficulty.message}
            </Text>
          )}
        </View>

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Description *"
              placeholder="Provide a detailed description of the problem"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              rows={6}
              error={errors.description?.message}
            />
          )}
        />

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Constraints</Text>
          <View style={styles.inputRow}>
            <Input
              placeholder="Add a constraint and press +"
              value={constraintInput}
              onChangeText={setConstraintInput}
              style={styles.flexInput}
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addConstraint}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.chipList}>
            {constraints.map((constraint, index) => (
              <View
                key={index}
                style={[styles.listChip, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={[styles.listChipText, { color: colors.text }]}>
                  {constraint}
                </Text>
                <TouchableOpacity onPress={() => removeConstraint(index)}>
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Requirements</Text>
          <View style={styles.inputRow}>
            <Input
              placeholder="Add a requirement and press +"
              value={requirementInput}
              onChangeText={setRequirementInput}
              style={styles.flexInput}
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addRequirement}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.chipList}>
            {requirements.map((requirement, index) => (
              <View
                key={index}
                style={[styles.listChip, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={[styles.listChipText, { color: colors.text }]}>
                  {requirement}
                </Text>
                <TouchableOpacity onPress={() => removeRequirement(index)}>
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Tags</Text>
          <View style={styles.inputRow}>
            <Input
              placeholder="Add tags for better discovery"
              value={tagInput}
              onChangeText={setTagInput}
              style={styles.flexInput}
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addTag}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.chipList}>
            {tags.map((tag, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: colors.primary + '20' }]}
              >
                <Text style={[styles.tagText, { color: colors.primary }]}>
                  #{tag}
                </Text>
                <TouchableOpacity onPress={() => removeTag(index)}>
                  <Ionicons name="close-circle" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.urgentToggle,
              {
                backgroundColor: urgent ? colors.error : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setUrgent(!urgent)}
          >
            <Ionicons
              name={urgent ? 'warning' : 'warning-outline'}
              size={24}
              color={urgent ? '#FFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.urgentText,
                { color: urgent ? '#FFF' : colors.text },
              ]}
            >
              Mark as Urgent
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Attachments (Optional)
          </Text>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={pickDocument}
          >
            <Ionicons name="cloud-upload-outline" size={32} color={colors.primary} />
            <Text style={[styles.uploadText, { color: colors.text }]}>
              Upload Files or Images
            </Text>
          </TouchableOpacity>
          {files.length > 0 && (
            <View style={styles.fileList}>
              {files.map((file, index) => (
                <View
                  key={index}
                  style={[styles.fileItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Ionicons name="document-outline" size={20} color={colors.primary} />
                  <Text
                    style={[styles.fileName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {file.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFiles(files.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close-circle" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Submit Problem"
            onPress={handleSubmit(onSubmit)}
            size="lg"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  chipList: {
    gap: 8,
    marginTop: 12,
  },
  listChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  listChipText: {
    flex: 1,
    fontSize: 14,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  urgentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  urgentText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileList: {
    marginTop: 12,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 8,
  },
});
